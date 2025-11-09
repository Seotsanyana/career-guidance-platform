// Transcript Parser - Handles Microsoft document formats and PDF parsing
import mammoth from 'mammoth'
import * as XLSX from 'xlsx'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { app } from './firebase-config'

// Initialize Firebase Storage
const storage = getStorage(app)

// Supported file types
export const SUPPORTED_FORMATS = {
    PDF: ['application/pdf'],
    DOCX: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    XLSX: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    DOC: ['application/msword'],
    XLS: ['application/vnd.ms-excel']
}

// File validation
export const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allSupportedTypes = Object.values(SUPPORTED_FORMATS).flat()

    if (!allSupportedTypes.includes(file.type)) {
        throw new Error('Unsupported file format. Please upload PDF, DOCX, XLSX, DOC, or XLS files.')
    }

    if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit.')
    }

    return true
}

// Upload file to Firebase Storage
export const uploadTranscript = async (file, userId) => {
    try {
        validateFile(file)

        const timestamp = Date.now()
        const fileName = `transcripts/${userId}/${timestamp}_${file.name}`
        const storageRef = ref(storage, fileName)

        const snapshot = await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(snapshot.ref)

        return {
            url: downloadURL,
            path: fileName,
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString()
        }
    } catch (error) {
        throw new Error(`Upload failed: ${error.message}`)
    }
}

// Parse PDF files
export const parsePDF = async (file) => {
    try {
        // For client-side, send to API route
        if (typeof window !== 'undefined') {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/parse-pdf', {
                method: 'POST',
                body: formData
            })

            const result = await response.json()

            if (!result.success) {
                throw new Error(result.error)
            }

            return result
        }

        // Server-side fallback (if needed)
        const data = await pdfParse(file)
        return {
            text: data.text,
            pages: data.numpages,
            info: data.info
        }
    } catch (error) {
        throw new Error(`PDF parsing failed: ${error.message}`)
    }
}

// Parse DOCX files
export const parseDOCX = async (file) => {
    try {
        const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
        return {
            text: result.value,
            messages: result.messages
        }
    } catch (error) {
        throw new Error(`DOCX parsing failed: ${error.message}`)
    }
}

// Parse Excel files
export const parseExcel = async (file) => {
    try {
        const data = await file.arrayBuffer()
        const workbook = XLSX.read(data, { type: 'array' })

        const sheets = {}
        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName]
            sheets[sheetName] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        })

        return {
            sheets,
            sheetNames: workbook.SheetNames
        }
    } catch (error) {
        throw new Error(`Excel parsing failed: ${error.message}`)
    }
}

// Extract academic data from parsed text
export const extractAcademicData = (text, fileType) => {
    const data = {
        subjects: [],
        grades: [],
        gpa: null,
        qualificationLevel: null,
        englishProficiency: false
    }

    // Convert to lowercase for easier matching
    const lowerText = text.toLowerCase()

    // Extract subjects and grades based on common patterns
    const subjectPatterns = [
        // LGCSE pattern: Subject: Grade
        /(?:subject|course):\s*([a-zA-Z\s]+?)(?:\s*[:-]\s*([A-F][+*]?|\d+\/\d+|[0-9]+))/gi,
        // Grade patterns
        /([A-Z][a-zA-Z\s]+?)\s*:\s*([A-F][+*]?|\d+\/\d+|[0-9]+(?:\.\d+)?)/gi,
        // Table-like patterns
        /([A-Z][a-zA-Z\s]{2,})\s+([A-F][+*]?|\d+\/\d+|[0-9]+(?:\.\d+)?)/gi
    ]

    subjectPatterns.forEach(pattern => {
        let match
        while ((match = pattern.exec(text)) !== null) {
            const subject = match[1].trim()
            const grade = match[2].trim()

            if (subject && grade && !data.subjects.includes(subject)) {
                data.subjects.push(subject)
                data.grades.push(grade)
            }
        }
    })

    // Extract GPA
    const gpaPatterns = [
        /gpa\s*:\s*([0-9]+(?:\.[0-9]+)?)/i,
        /grade point average\s*:\s*([0-9]+(?:\.[0-9]+)?)/i,
        /overall gpa\s*:\s*([0-9]+(?:\.[0-9]+)?)/i,
        /cumulative gpa\s*:\s*([0-9]+(?:\.[0-9]+)?)/i
    ]

    gpaPatterns.forEach(pattern => {
        const match = text.match(pattern)
        if (match && !data.gpa) {
            data.gpa = parseFloat(match[1])
        }
    })

    // Determine qualification level
    if (lowerText.includes('lgcse') || lowerText.includes('junior certificate')) {
        data.qualificationLevel = 'certificate'
    } else if (lowerText.includes('cosc') || lowerText.includes('senior certificate') || lowerText.includes('diploma')) {
        data.qualificationLevel = 'diploma'
    } else if (lowerText.includes('degree') || lowerText.includes('bachelor') || lowerText.includes('university')) {
        data.qualificationLevel = 'degree'
    }

    // Check English proficiency
    const englishPatterns = [
        /english.*:\s*([A-F][+*]?|\d+\/\d+|[0-9]+(?:\.\d+)?)/i,
        /english language.*:\s*([A-F][+*]?|\d+\/\d+|[0-9]+(?:\.\d+)?)/i
    ]

    englishPatterns.forEach(pattern => {
        const match = text.match(pattern)
        if (match) {
            const grade = match[1]
            // Consider C or better as proficient
            if (['A*', 'A', 'B', 'C'].includes(grade) || parseFloat(grade) >= 2.0) {
                data.englishProficiency = true
            }
        }
    })

    return data
}

// Extract data from Excel sheets
export const extractExcelData = (sheets) => {
    const data = {
        subjects: [],
        grades: [],
        gpa: null,
        qualificationLevel: null,
        englishProficiency: false
    }

    // Look for common sheet names
    const relevantSheets = ['results', 'grades', 'subjects', 'transcript', 'sheet1']

    for (const sheetName of relevantSheets) {
        if (sheets[sheetName]) {
            const rows = sheets[sheetName]

            // Skip header rows
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i]
                if (row.length >= 2) {
                    const subject = row[0]?.toString().trim()
                    const grade = row[1]?.toString().trim()

                    if (subject && grade && !data.subjects.includes(subject)) {
                        data.subjects.push(subject)
                        data.grades.push(grade)
                    }
                }
            }
        }
    }

    // Look for GPA in any cell
    Object.values(sheets).forEach(sheetRows => {
        sheetRows.forEach(row => {
            row.forEach(cell => {
                if (cell && typeof cell === 'string') {
                    const gpaMatch = cell.match(/gpa\s*:\s*([0-9]+(?:\.[0-9]+)?)/i)
                    if (gpaMatch && !data.gpa) {
                        data.gpa = parseFloat(gpaMatch[1])
                    }
                }
            })
        })
    })

    return data
}

// Main parsing function
export const parseTranscript = async (file) => {
    try {
        let parsedData = { text: '', sheets: null }
        let extractedData = {
            subjects: [],
            grades: [],
            gpa: null,
            qualificationLevel: null,
            englishProficiency: false
        }

        if (SUPPORTED_FORMATS.PDF.includes(file.type)) {
            parsedData = await parsePDF(file)
            extractedData = extractAcademicData(parsedData.text, 'pdf')
        } else if (SUPPORTED_FORMATS.DOCX.includes(file.type) || SUPPORTED_FORMATS.DOC.includes(file.type)) {
            parsedData = await parseDOCX(file)
            extractedData = extractAcademicData(parsedData.text, 'docx')
        } else if (SUPPORTED_FORMATS.XLSX.includes(file.type) || SUPPORTED_FORMATS.XLS.includes(file.type)) {
            parsedData.sheets = await parseExcel(file)
            extractedData = extractExcelData(parsedData.sheets)
        }

        return {
            success: true,
            data: extractedData,
            rawData: parsedData,
            fileType: file.type,
            fileName: file.name
        }
    } catch (error) {
        return {
            success: false,
            error: error.message,
            fileType: file.type,
            fileName: file.name
        }
    }
}

// Convert grade to GPA points
export const gradeToPoints = (grade) => {
    const gradeMap = {
        'A*': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0
    }

    // Handle numeric grades
    if (!isNaN(grade)) {
        return parseFloat(grade)
    }

    // Handle letter grades
    return gradeMap[grade.toUpperCase()] || 0
}

// Calculate GPA from subjects and grades
export const calculateGPAFromData = (subjects, grades) => {
    if (subjects.length === 0 || grades.length === 0) return null

    const points = grades.map(grade => gradeToPoints(grade))
    const totalPoints = points.reduce((sum, point) => sum + point, 0)

    return totalPoints / grades.length
}

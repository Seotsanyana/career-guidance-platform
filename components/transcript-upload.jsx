"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Edit } from "lucide-react"
import { parseTranscript, uploadTranscript, SUPPORTED_FORMATS } from "@/lib/transcript-parser"
import { performTranscriptQualificationCheck } from "@/lib/qualification-checker"

export default function TranscriptUpload({ onTranscriptParsed, studentData = {} }) {
    const [uploadedFile, setUploadedFile] = useState(null)
    const [parsingStatus, setParsingStatus] = useState(null) // null, 'uploading', 'parsing', 'success', 'error'
    const [parsedData, setParsedData] = useState(null)
    const [editableData, setEditableData] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const { toast } = useToast()

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]
        if (file) {
            setUploadedFile(file)
            setParsingStatus(null)
            setParsedData(null)
            setEditableData(null)
            setIsEditing(false)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/msword': ['.doc'],
            'application/vnd.ms-excel': ['.xls']
        },
        multiple: false,
        maxSize: 10 * 1024 * 1024 // 10MB
    })

    const handleUploadAndParse = async () => {
        if (!uploadedFile) return

        try {
            setParsingStatus('uploading')
            setUploadProgress(0)

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval)
                        return 90
                    }
                    return prev + 10
                })
            }, 200)

            // Upload to Firebase Storage (mock for now)
            const uploadResult = await uploadTranscript(uploadedFile, 'student-user-id')

            clearInterval(progressInterval)
            setUploadProgress(100)

            setParsingStatus('parsing')

            // Parse the transcript
            const parseResult = await parseTranscript(uploadedFile)

            if (parseResult.success) {
                setParsedData(parseResult.data)
                setEditableData({ ...parseResult.data })
                setParsingStatus('success')

                // Perform qualification check
                const qualificationCheck = performTranscriptQualificationCheck(parseResult.data, studentData)

                // Notify parent component
                if (onTranscriptParsed) {
                    onTranscriptParsed({
                        ...parseResult,
                        qualificationCheck,
                        uploadedFile: uploadResult
                    })
                }

                toast({
                    title: "Transcript Processed Successfully",
                    description: "Your transcript has been parsed and qualification check completed.",
                })
            } else {
                setParsingStatus('error')
                toast({
                    title: "Parsing Failed",
                    description: parseResult.error,
                    variant: "destructive"
                })
            }
        } catch (error) {
            setParsingStatus('error')
            toast({
                title: "Upload Failed",
                description: error.message,
                variant: "destructive"
            })
        }
    }

    const handleSaveEdits = () => {
        setParsedData({ ...editableData })
        setIsEditing(false)

        // Re-run qualification check with edited data
        const qualificationCheck = performTranscriptQualificationCheck(editableData, studentData)

        if (onTranscriptParsed) {
            onTranscriptParsed({
                success: true,
                data: editableData,
                qualificationCheck
            })
        }

        toast({
            title: "Changes Saved",
            description: "Your transcript data has been updated.",
        })
    }

    const handleCancelEdit = () => {
        setEditableData({ ...parsedData })
        setIsEditing(false)
    }

    const updateSubjectGrade = (index, field, value) => {
        const updatedSubjects = [...editableData.subjects]
        const updatedGrades = [...editableData.grades]

        if (field === 'subject') {
            updatedSubjects[index] = value
        } else if (field === 'grade') {
            updatedGrades[index] = value
        }

        setEditableData({
            ...editableData,
            subjects: updatedSubjects,
            grades: updatedGrades
        })
    }

    const addSubjectGrade = () => {
        setEditableData({
            ...editableData,
            subjects: [...editableData.subjects, ''],
            grades: [...editableData.grades, '']
        })
    }

    const removeSubjectGrade = (index) => {
        const updatedSubjects = editableData.subjects.filter((_, i) => i !== index)
        const updatedGrades = editableData.grades.filter((_, i) => i !== index)

        setEditableData({
            ...editableData,
            subjects: updatedSubjects,
            grades: updatedGrades
        })
    }

    const getFileIcon = (fileType) => {
        if (fileType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />
        if (fileType.includes('word') || fileType.includes('document')) return <FileText className="w-8 h-8 text-blue-500" />
        if (fileType.includes('sheet') || fileType.includes('excel')) return <FileText className="w-8 h-8 text-green-500" />
        return <FileText className="w-8 h-8 text-gray-500" />
    }

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Upload Academic Transcript
                    </CardTitle>
                    <CardDescription>
                        Upload your LGCSE, COSC, or university transcript in PDF, DOCX, or Excel format (max 10MB)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        {isDragActive ? (
                            <p className="text-blue-600 font-medium">Drop your transcript here...</p>
                        ) : (
                            <div>
                                <p className="text-gray-600 mb-2">
                                    Drag & drop your transcript file here, or click to browse
                                </p>
                                <p className="text-sm text-gray-500">
                                    Supported formats: PDF, DOCX, XLSX, DOC, XLS
                                </p>
                            </div>
                        )}
                    </div>

                    {uploadedFile && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                {getFileIcon(uploadedFile.type)}
                                <div className="flex-1">
                                    <p className="font-medium">{uploadedFile.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                                <Badge variant="secondary">
                                    {uploadedFile.type.split('/')[1].toUpperCase()}
                                </Badge>
                            </div>

                            {parsingStatus === 'uploading' && (
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Uploading...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <Progress value={uploadProgress} className="w-full" />
                                </div>
                            )}

                            {parsingStatus === 'parsing' && (
                                <div className="mt-4 flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    <span className="text-sm text-blue-600">Parsing transcript...</span>
                                </div>
                            )}

                            <div className="mt-4 flex gap-2">
                                <Button
                                    onClick={handleUploadAndParse}
                                    disabled={parsingStatus === 'uploading' || parsingStatus === 'parsing'}
                                    className="flex-1"
                                >
                                    {parsingStatus === 'uploading' ? 'Uploading...' :
                                        parsingStatus === 'parsing' ? 'Processing...' : 'Process Transcript'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setUploadedFile(null)
                                        setParsingStatus(null)
                                        setParsedData(null)
                                        setEditableData(null)
                                        setIsEditing(false)
                                    }}
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Parsed Data Display */}
            {parsedData && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                {parsingStatus === 'success' ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                                )}
                                Extracted Academic Data
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                {isEditing ? 'Cancel Edit' : 'Edit Data'}
                            </Button>
                        </CardTitle>
                        <CardDescription>
                            Review and edit the extracted information from your transcript
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* GPA and Qualification Level */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Calculated GPA</label>
                                {isEditing ? (
                                    <Input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={editableData.gpa || ''}
                                        onChange={(e) => setEditableData({ ...editableData, gpa: parseFloat(e.target.value) || null })}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="text-lg font-semibold text-blue-600 mt-1">
                                        {parsedData.gpa ? parsedData.gpa.toFixed(2) : 'Not detected'}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Qualification Level</label>
                                {isEditing ? (
                                    <select
                                        value={editableData.qualificationLevel || ''}
                                        onChange={(e) => setEditableData({ ...editableData, qualificationLevel: e.target.value })}
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Select level</option>
                                        <option value="certificate">Certificate</option>
                                        <option value="diploma">Diploma</option>
                                        <option value="degree">Degree</option>
                                    </select>
                                ) : (
                                    <p className="text-lg font-semibold text-green-600 mt-1 capitalize">
                                        {parsedData.qualificationLevel || 'Not detected'}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">English Proficiency</label>
                                {isEditing ? (
                                    <select
                                        value={editableData.englishProficiency ? 'true' : 'false'}
                                        onChange={(e) => setEditableData({ ...editableData, englishProficiency: e.target.value === 'true' })}
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                ) : (
                                    <div className="flex items-center mt-1">
                                        {parsedData.englishProficiency ? (
                                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-600 mr-2" />
                                        )}
                                        <span className={parsedData.englishProficiency ? 'text-green-600' : 'text-red-600'}>
                                            {parsedData.englishProficiency ? 'Proficient' : 'Not detected'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Subjects and Grades */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-medium text-gray-700">Subjects and Grades</label>
                                {isEditing && (
                                    <Button size="sm" variant="outline" onClick={addSubjectGrade}>
                                        Add Subject
                                    </Button>
                                )}
                            </div>

                            {parsedData.subjects && parsedData.subjects.length > 0 ? (
                                <div className="space-y-2">
                                    {parsedData.subjects.map((subject, index) => (
                                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                            {isEditing ? (
                                                <>
                                                    <Input
                                                        placeholder="Subject name"
                                                        value={editableData.subjects[index] || ''}
                                                        onChange={(e) => updateSubjectGrade(index, 'subject', e.target.value)}
                                                        className="flex-1"
                                                    />
                                                    <Input
                                                        placeholder="Grade"
                                                        value={editableData.grades[index] || ''}
                                                        onChange={(e) => updateSubjectGrade(index, 'grade', e.target.value)}
                                                        className="w-20"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => removeSubjectGrade(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex-1">
                                                        <span className="font-medium">{subject}</span>
                                                    </div>
                                                    <Badge variant="secondary" className="w-16 justify-center">
                                                        {parsedData.grades[index] || 'N/A'}
                                                    </Badge>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No subjects detected in transcript</p>
                            )}
                        </div>

                        {/* Edit Actions */}
                        {isEditing && (
                            <div className="flex gap-2 pt-4 border-t">
                                <Button onClick={handleSaveEdits} className="flex-1">
                                    Save Changes
                                </Button>
                                <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Error Display */}
            {parsingStatus === 'error' && (
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to process the transcript. Please ensure the file is in the correct format and try again.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}

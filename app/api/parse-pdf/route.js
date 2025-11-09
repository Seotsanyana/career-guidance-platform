import { NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'

export async function POST(request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file')

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer())

        // Parse PDF
        const data = await pdfParse(buffer)

        return NextResponse.json({
            success: true,
            text: data.text,
            pages: data.numpages,
            info: data.info
        })
    } catch (error) {
        console.error('PDF parsing error:', error)
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}

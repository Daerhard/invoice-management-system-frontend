import React, { useState } from 'react';
import { Button, Typography, CircularProgress } from '@mui/material';
import { ImportCSVDataBody } from '../../api/generated/Schemas'
import { importCSVData } from '../../api/generated/csvimport'


const CSVImportComponent = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Please select a valid CSV file.');
        }
    };

    // Handle file import
    const handleImportCSV = async () => {
        if (!file) {
            setError('Please select a CSV file first.');
            return;
        }

        setLoading(true);
        const formData: ImportCSVDataBody = {
            file: file
        };

        try {
            const response = await importCSVData(formData);
            setLoading(false);
            setMessage('File uploaded successfully!');
            // Optionally handle the response here if needed
        } catch (err) {
            setLoading(false);
            setError('Failed to upload the file. Please try again.');
        }
    };

    return (
        <div>
            <Typography variant="h6">Import CSV File</Typography>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ marginBottom: '1rem' }}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button
                variant="contained"
                color="primary"
                onClick={handleImportCSV}
                disabled={loading || !file}
                style={{ marginTop: '1rem' }}
            >
                {loading ? <CircularProgress size={24} /> : 'Import CSV'}
            </Button>
            {message && <Typography color="primary" style={{ marginTop: '1rem' }}>{message}</Typography>}
        </div>
    );
};

export default CSVImportComponent;

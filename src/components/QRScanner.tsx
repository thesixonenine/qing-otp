import { QrReader } from 'react-qr-reader'
import { Dialog, DialogContent } from '@mui/material'

export default function QRScanner({ open, onClose, onScan }: {
    open: boolean
    onClose: () => void
    onScan: (data: string) => void
}) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <QrReader
                    onResult={(result) => {
                        if (result) onScan(result.getText())
                    }}
                    constraints={{ facingMode: 'environment' }}
                />
            </DialogContent>
        </Dialog>
    )
}

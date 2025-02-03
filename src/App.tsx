import { useState, useEffect } from 'react';
import { invoke } from "@tauri-apps/api/core";
import { save, open } from "@tauri-apps/plugin-dialog";
import { writeTextFile, readTextFile } from "@tauri-apps/plugin-fs";
// import { useTheme } from '@mui/material/styles';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    CssBaseline,
    ThemeProvider,
    createTheme
} from '@mui/material'
import { QrCodeScanner } from '@mui/icons-material'
import OTPList from './components/OTPList'
import QRScanner from './components/QRScanner'
import SettingsMenu from './components/SettingsMenu'

interface OTPItem {
    id: string
    name: string
    secret: string
}

export default function App() {
    const [items, setItems] = useState<OTPItem[]>([])
    const [scanOpen, setScanOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(false)

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    })

    // 持久化存储
    useEffect(() => {
        const load = async () => {
            try {
                const data:string = await invoke('load_otps')
                setItems(JSON.parse(data))
            } catch {}
        }
        load()
    }, [])

    const persist = async (newItems: OTPItem[]) => {
        await invoke('save_otps', { data: JSON.stringify(newItems) })
    }

    // OTP操作
    const handleAddOTP = (data: string) => {
        // 这里应使用zod验证数据格式
        const newItem = { id: crypto.randomUUID(), name: data, secret: data }
        setItems(prev => {
            const newItems = [...prev, newItem]
            persist(newItems)
            return newItems
        })
    }

    const handleDelete = (id: string) => {
        setItems(prev => {
            const newItems = prev.filter(i => i.id !== id)
            persist(newItems)
            return newItems
        })
    }

    // 备份/恢复
    const handleBackup = async () => {
        const path = await save({
            filters: [{ name: 'OTP Backup', extensions: ['json'] }]
        })
        if (path) await writeTextFile(path, JSON.stringify(items))
    }

    const handleRestore = async () => {
        const path = await open({
            filters: [{ name: 'OTP Backup', extensions: ['json'] }]
        })
        if (path) {
            const data = await readTextFile(path)
            setItems(JSON.parse(data))
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="h-screen flex flex-col">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>Qing OTP</Typography>

                        <IconButton color="inherit" onClick={() => setScanOpen(true)}>
                            <QrCodeScanner />
                        </IconButton>

                        <SettingsMenu
                            darkMode={darkMode}
                            onDarkModeToggle={() => setDarkMode(!darkMode)}
                            onBackup={handleBackup}
                            onRestore={handleRestore}
                            onCheckUpdate={() => {/* 实现更新逻辑 */}}
                            version={import.meta.env.VITE_APP_VERSION}
                        />
                    </Toolbar>
                </AppBar>

                <QRScanner
                    open={scanOpen}
                    onClose={() => setScanOpen(false)}
                    onScan={handleAddOTP}
                />

                <OTPList items={items} onDelete={handleDelete} />
            </div>
        </ThemeProvider>
    )
}

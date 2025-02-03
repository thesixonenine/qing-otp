import { useState } from 'react'
import {
    Menu,
    MenuItem,
    IconButton,
    ListItemIcon,
    Typography,
    Switch
} from '@mui/material'
import {
    Settings,
    DarkMode,
    Backup,
    Update,
    SystemUpdate
} from '@mui/icons-material'

export default function SettingsMenu({
                                         darkMode,
                                         onDarkModeToggle,
                                         onBackup,
                                         onRestore,
                                         onCheckUpdate,
                                         version
                                     }: {
    darkMode: boolean
    onDarkModeToggle: () => void
    onBackup: () => void
    onRestore: () => void
    onCheckUpdate: () => void
    version: string
}) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    return (
        <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Settings />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={onDarkModeToggle}>
                    <ListItemIcon><DarkMode /></ListItemIcon>
                    <Typography>暗黑模式</Typography>
                    <Switch checked={darkMode} />
                </MenuItem>

                <MenuItem onClick={onBackup}>
                    <ListItemIcon><Backup /></ListItemIcon>
                    备份到文件
                </MenuItem>

                <MenuItem onClick={onRestore}>
                    <ListItemIcon><SystemUpdate /></ListItemIcon>
                    从文件恢复
                </MenuItem>

                <MenuItem onClick={onCheckUpdate}>
                    <ListItemIcon><Update /></ListItemIcon>
                    检查更新
                </MenuItem>

                <MenuItem disabled>
                    <Typography variant="caption">当前版本: {version}</Typography>
                </MenuItem>
            </Menu>
        </>
    )
}

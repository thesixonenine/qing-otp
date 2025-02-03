import { useState } from 'react'
import { List, ListItem, ListItemText, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'

export interface OTPItem {
    id: string
    name: string
    secret: string
}

export default function OTPList({ items, onDelete }: {
    items: OTPItem[]
    onDelete: (id: string) => void
}) {
    const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set())

    const toggleSecret = (id: string) => {
        const newSet = new Set(visibleSecrets)
        newSet.has(id) ? newSet.delete(id) : newSet.add(id)
        setVisibleSecrets(newSet)
    }

    return (
        <List>
            {items.map((item) => (
                <ListItem
                    key={item.id}
                    secondaryAction={
                        <IconButton edge="end" onClick={() => onDelete(item.id)}>
                            <Delete />
                        </IconButton>
                    }
                >
                    <ListItemText
                        primary={item.name}
                        secondary={visibleSecrets.has(item.id) ? generateOTP(item.secret) : '••••••'}
                        onClick={() => toggleSecret(item.id)}
                    />
                </ListItem>
            ))}
        </List>
    )
}

// 简单的OTP生成示例（实际应使用合适的库）
function generateOTP(secret: string): string {
    return Math.floor(100000 + Math.random() * 900000).toString() + secret;
}

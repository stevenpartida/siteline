export type User = {
    id: string
    full_name: string | null
    created_at: string
}

export type Company = {
    id: string
    name: string
    owner_id: string
    created_at: string
    updated_at: string
}

export type CompanyMember = {
    company_id: string
    user_id: string
    role: "owner" | "crew"
    added_at: string
}
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    price: string | null
                    unit: string | null
                    image: string | null
                    popular: boolean | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    price?: string | null
                    unit?: string | null
                    image?: string | null
                    popular?: boolean | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    price?: string | null
                    unit?: string | null
                    image?: string | null
                    popular?: boolean | null
                    created_at?: string
                }
            }
            pedidos: {
                Row: {
                    id: number
                    created_at: string
                    nombre_cliente: string | null
                    telefono: string | null
                    correo_e: string | null
                    metodo_pago: string | null
                    cant_producto: string | null
                }
                Insert: {
                    id?: number
                    created_at?: string
                    nombre_cliente?: string | null
                    telefono?: string | null
                    correo_e?: string | null
                    metodo_pago?: string | null
                    cant_producto?: string | null
                }
                Update: {
                    id?: number
                    created_at?: string
                    nombre_cliente?: string | null
                    telefono?: string | null
                    correo_e?: string | null
                    metodo_pago?: string | null
                    cant_producto?: string | null
                }
            }
        }
    }
}

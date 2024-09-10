"use client"

import { ApiList } from "@/components/ui/api-list"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { CategoryColumn, columns } from "./columns"

interface CategorieClientProps {
  data: CategoryColumn[]
}


export const  CategorieClient:React.FC<CategorieClientProps> = ({
  data
}) => {
const router = useRouter()
  const params = useParams();


  return (
    <>
    <div className=" flex items-center justify-between">
<Heading 
title={`Categories (${data.length})`}
description="Gerez vos categories pour votre magasin"
/>
<Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
  <Plus className="mr-2 h-4 w-4"/>
    Add New
</Button>
    </div>
    <Separator/>
    <DataTable searchKey="name" columns={columns} data={data}/>
    <Heading title="API" description="API calls for Categories" />
   <Separator/>
   <ApiList entityName="categories" entityIdName="categoryId"/>
    </>
  )
}
"use client"

import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { OrderColumn, columns } from "./columns"

interface OrderClientProps {
  data: OrderColumn[]
}


export const  OrderClient:React.FC<OrderClientProps> = ({
  data
}) => {
  return (
    <>
  
<Heading 
title={`Order (${data.length})`}
description="Gerez vos ordres pour votre magasin"
/>
    <Separator/>
    <Heading title="API" description="API calls for Billboards" />
   <Separator/>
   <DataTable searchKey="label" columns={columns} data={data}/>

 
    </>
  )
}
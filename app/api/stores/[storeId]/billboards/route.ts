import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"




export async function POST(
  req:Request,
  {params}: {params: {storeId: string}}
){
  try {
  const {userId} = auth()
  const body = await req.json()

  const {label, imageUrl} = body

  if(!userId) {
    return new NextResponse("Unauthenticated", {status:401})
  }

  if(!label) {
    return new NextResponse('label requis',{status: 404})
  }

  if(!imageUrl) {
    return new NextResponse('Image Url requis',{status: 400})
  }

  if(!params.storeId) {
    return new NextResponse("Store id est requis, {status:400}")
  }


  const billboard = await prismadb.billboard.create({
    data:{
      label,
      imageUrl,
      storeId:params.storeId
    },
    
   })

  const storeByUserId= await prismadb.store.findFirst({
    where:{
      id:params.storeId,
      userId
},
    })

    if(!storeByUserId){
      return new NextResponse(" Unauthorized", {status:403})
    }


    if(!params.storeId) {
      return new NextResponse("Unauthorized", {status:403})
    }

  

return NextResponse.json(billboard)
  }catch (error) {
    console.log('[BIILBOARDS_PATCH]',error );
    return new NextResponse("Internal error", {status: 500})

  }
};



export async function GET(
  req:Request,
  {params}: {params: {storeId: string}}
){
  try {
  
  if(!params.storeId) {
    return new NextResponse("Store id est requis, {status:400}")
  }

  const billboards = await prismadb.billboard.findMany({
    where:{
      storeId: params.storeId
      
},
    })


return NextResponse.json(billboards)
  }catch (error) {
    console.log('[BIILBOARDS_GET',error );
    return new NextResponse("Internal error", {status: 500})

  }
};

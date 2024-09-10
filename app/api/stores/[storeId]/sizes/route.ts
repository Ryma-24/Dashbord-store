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

  const {name ,value } = body

  if(!userId) {
    return new NextResponse("Unauthenticated", {status:401})
  }

  if(!name) {
    return new NextResponse('name requis',{status: 404})
  }

  if(!value) {
    return new NextResponse('Value id requis',{status: 400})
  }

  if(!params.storeId) {
    return new NextResponse("Store id est requis", {status:400})
  }

  const storeByUserId= await prismadb.store.findFirst({
    where:{
      id:params.storeId,
      userId
},
    })


    if(!storeByUserId){
      return new NextResponse(" Unauthorized", {status:403})
    }


  const size = await prismadb.size.create({
    data:{
      name,
      value,
      storeId:params.storeId
    },
    
   })





  

return NextResponse.json(size)
  }catch (error) {
    console.log('[SIZES_POST]',error );
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

  const sizes = await prismadb.size.findMany({
    where:{
      storeId: params.storeId
      
},
    })


return NextResponse.json(sizes)
  }catch (error) {
    console.log('[SIZES_GET',error );
    return new NextResponse("Internal error", {status: 500})

  }
};

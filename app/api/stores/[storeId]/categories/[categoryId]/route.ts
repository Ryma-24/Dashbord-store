import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"






export async function GET(
  req:Request,
  {params}: {params: {categoryId:string}}
){
  try {

  if(!params.categoryId) {
  return new NextResponse("Category est requis", {status:400})
  }


    const category = await prismadb.category.findUnique({
      where:{
        id: params.categoryId, 
        },
        include: {
          billboard : true,
        }
     })

return NextResponse.json(category)
  }catch (error) {
    console.log('[CATEGORY_GET]',error );
    return new NextResponse("Internal error", {status: 500})

  }
};



export async function PATCH(
  req:Request,
  {params}: {params: {storeId:string, categoryId: string}}
){
  try {
  const {userId} = auth()
  const body = await req.json()
  const {name, billboardId} = body

  if(!userId) {
    return new NextResponse("Unauthenticated", {status:401})
  }

  if(!name) {
    return new NextResponse('Name requis',{status: 404})
  }

  if(!billboardId) {
    return new NextResponse('Billboard Id requis',{status: 404})
  }

  if(!params.categoryId) {
  return new NextResponse("sizeId est requis", {status:404})
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
    

    const categories = await prismadb.category.updateMany({
      where:{
        id: params.categoryId,
        
      },
      data: { name,
        billboardId
 }
     })

  

return NextResponse.json(categories)
  }catch (error) {
    console.log('[CATEGORY_PATCH]',error );
    return new NextResponse("Internal error", {status: 500})

  }
};



export async function DELETE(
  req:Request,
  {params}: {params: {storeId:string, categoryId: string}}
){
  try {
  const {userId} = auth()
  

  if(!userId) {
    return new NextResponse("Unauthenticated", {status:401})
  }


  if(!params.categoryId) {
  return new NextResponse("Categorie est requis", {status:404})
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



    const category = await prismadb.category.deleteMany({
      where:{
        id: params.categoryId,
        
      }
     })

return NextResponse.json(category)
  }catch (error) {
    console.log('[CATEGORY_DELETE]',error );
    return new NextResponse("Internal error", {status: 500})

  }
};
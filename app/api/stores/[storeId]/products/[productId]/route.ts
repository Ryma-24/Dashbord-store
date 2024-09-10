import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"






export async function GET(
  req:Request,
  {params}: {params: {productId:string}}
){
  try {

  if(!params.productId) {
  return new NextResponse("Billboard est requis", {status:404})
  }


    const product = await prismadb.product.findUnique({
      where:{
        id: params.productId,
        },
        include: {
          images:true,
          category: true,
          size:true,
          color:true
        }
     })

return NextResponse.json(product)
  }catch (error) {
    console.log('[PRODUCT_GET]',error );
    return new NextResponse("Internal error", {status: 500})

  }
};



export async function PATCH(
  req:Request,
  {params}: {params: {productId:string, storeId: string}}
){
  try {
  const {userId} = auth()
  const body = await req.json()

  const {
    name,
    price,
    sizeId,
    colorId,
    categoryId,
    images,
    isFeatured,
    isArchived
  } = body

  if(!userId) {
    return new NextResponse("Unauthenticated", {status:401})
  }

  
  if(!name) {
    return new NextResponse('Name requis',{status: 404})
  }

  if (!images || !images.length) {
    return new NextResponse("Image requise",{status: 400} )
  }

  if(!sizeId) {
    return new NextResponse('Taile requis',{status: 400})
  }

  if(!price) {
    return new NextResponse('Prix requis',{status: 400})
  }
 
  if(!colorId) {
    return new NextResponse('Couleur requis',{status: 400})
  }

  if(!categoryId) {
    return new NextResponse('Categorie requis',{status: 400})
  }

  if(!params.productId) {
  return new NextResponse("Produit est requis", {status:404})
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


      await prismadb.product.update({
      where:{
        id: params.productId,
        
      },
      data: { 
        name,
        price,
        sizeId,
        categoryId,
        colorId,
        images: {
          deleteMany:{}
        },
        isFeatured,
        isArchived,

 }
     });

  const product = await prismadb.product.update({
    where:{
      id: params.productId
    },
    data: {
      images: {
        createMany: {
          data: [
            ...images.map((image: {url: string})=> image)
          ]
        }
      }
    }
  })

return NextResponse.json(product)
  }catch (error) {
    console.log('[PRODUCT_PATCH]',error );
    return new NextResponse("Internal error", {status: 500})

  }
};



export async function DELETE(
  req:Request,
  {params}: {params: {productId:string, storeId: string}}
){
  try {
  const {userId} = auth()
  

  if(!userId) {
    return new NextResponse("Unauthenticated", {status:401})
  }


  if(!params.productId) {
  return new NextResponse("Product est requis", {status:404})
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



    const product = await prismadb.product.deleteMany({
      where:{
        id: params.productId,
        
      }
     })

return NextResponse.json(product)
  }catch (error) {
    console.log('[PRODUCT_DELETE]',error );
    return new NextResponse("Internal error", {status: 500})

  }
};
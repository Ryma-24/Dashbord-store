import { format } from 'date-fns';

import prismadb from "@/lib/prismadb";
import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";


const BillboardsPage = async ({
  params
}: {
  params : {storeId: string }
}) => {
  const billboards = await prismadb.billboard.findMany( {
    where : {
      storeId: params.storeId
    }, 
    orderBy : {
      createAt: 'desc'
    }
  });

  const formatteBillboards: BillboardColumn[]= billboards.map((item) => ({
    id:item.id,
    label: item.label,
    createAt: format(item.createAt, "MMMM do,yyyy")
  }))



return(
  <div className="flex-col">
 <div className="flex-1 space-y-4 p-8 pt-6"></div>
    <BillboardClient data={formatteBillboards}/>
  </div>
)

}

export default BillboardsPage;
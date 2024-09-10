import { format } from 'date-fns';

import prismadb from "@/lib/prismadb";
import { ColorsClient } from './components/client';
import { ColorsColumn } from './components/columns';

const ColorPage = async ({
  params
}: {
  params : {storeId: string }
}) => {
  const colors = await prismadb.color.findMany( {
    where : {
      storeId: params.storeId
    }, 
    orderBy : {
      createAt: 'desc'
    }
  });

  const formattedColors: ColorsColumn[]= colors.map((item) => ({
    id:item.id,
    name: item.name,
    value: item.value,
    createAt: format(item.createAt, "MMMM do,yyyy")
  }))



return(
  <div className="flex-col">
 <div className="flex-1 space-y-4 p-8 pt-6"></div>
    <ColorsClient data={formattedColors}/>
  </div>
)

}

export default ColorPage;
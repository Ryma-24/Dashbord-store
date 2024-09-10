"use client"

import { useStoreModal } from "@/hook/use-store-modal";
import { cn } from "@/lib/utils";
import { Store } from "@prisma/client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "cmdk";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";



type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[]
}

export default function StoreSwitcher({
  className,
  items = []
}: StoreSwitcherProps ) {

const storeModal= useStoreModal();
const params = useParams();
const router =useRouter()


const formattedItems = items.map((item)=>({
  label: item.name,
  value: item.id
}));


const currentStore = formattedItems.find((item) => item.value === params.storeId)

const [open , setOpen] = useState(false)


const onStoreSelect = (store :{value: string, label: string}) => {
 setOpen(false) 
 router.push(`/${store.value}`);
}

  return (
   <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
    <Button
    variant="outline"
    size="sm"
    role="combobox"
    aria-expanded={open}
    aria-label="Select a store "
    className={cn("w-[200px] justify-between cursor-pointer ", className)}
    >
     
     <StoreIcon className="mr-2 h-4 w-4"  />
  
     {currentStore?.label}
     <ChevronsUpDown className=" ml-auto h-4 w-4 shrink-0 opacity-50"/>
    </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[200px] p-0">
    <Command>
      <CommandList>
        <CommandInput placeholder="Recherche du magasin..." />
      <CommandEmpty>Pas de magasin trouvé</CommandEmpty>
      <CommandGroup heading="Stores">
      {formattedItems.map((store)=>(
        <CommandItem 
        
        key={store.value} 
        onSelect={() => onStoreSelect(store)}
        className="text-sm cursor-pointer"
        >

          <StoreIcon className="mr-2 h-4 w-4"/>
          {store.label}
          <Check
          className={cn(
            "ml-auto h-4 w-4",
          currentStore?.value === store.value
          ? "opactity-100"
          :"opacity-0"
          
          )}
          
          />
        </CommandItem>
        ))}
      </CommandGroup>
      </CommandList>
      <CommandSeparator/>
      <CommandList>
        <CommandGroup>
          <CommandItem className="cursor-pointer"
          onSelect={() =>{
            setOpen(false)
            storeModal.onOpen()
          }}
          >
            <PlusCircle className="mr-2 h-5 w-5"/>
            Creation de magasin
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
    </PopoverContent>

   </Popover>
  )
}
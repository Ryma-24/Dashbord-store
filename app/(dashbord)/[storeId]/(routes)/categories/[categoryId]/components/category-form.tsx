"use client";


import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { Trash } from "lucide-react";

import { useOrigin } from "@/hook/use-orign";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";


import { AlertModal } from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";
import * as z from "zod";




        const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1)
});

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
  initialData: Category | null
  billboards : Billboard[]
}


export const CategoryForm:React.FC<CategoryFormProps> = ({
  initialData,
  billboards
}) => {

  const params= useParams();
  const router = useRouter();
  const origin = useOrigin();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? 'Editer le categorie' : "Crée le categorie"
    const description = initialData ? 'Editer le categorie' : "Crée le nouveau categorie"
    const toastMessage = initialData ? 'Categorie modifié' : "Categorie crée."
    const action = initialData ? 'Categorie sauvegardé' : "Nouvelle creation"

    

   const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData  || {
      name: '',
      billboardId:""
    }
   })

   const onSubmit = async (data : CategoryFormValues) => {
    try {
      setLoading(true)
      if(initialData) {
      await axios.patch(`/api/stores/${params.storeId}/categories/${params.categoryId}`, data )
      } else {
      await axios.post(`/api/stores/${params.storeId}/categories`, data )
      }
      router.refresh()
      router.push(`/${params.storeId}/categories`)
      toast.success("Categorie crée")
      console.log(data)
    } catch(error){
      toast.error(toastMessage)
      console.log(error)
    }finally{
      setLoading(false)
    }
   };

   const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/stores/${params.storeId}/categories/${params.categoryId}` )
            router.refresh()
            router.push(`/${params.storeId}/categories`);
      toast.success("categorie supprimé")
    }catch(error) {
      toast.error("Voulez-vous supprimé cette categorie ")
    }finally{
      setLoading(false)
      setOpen(false)
    }
   }


  return (
    <>
   <AlertModal
   isOpen={open}
   onClose={() => setOpen(false)}
   onConfirm={onDelete}
   loading={loading}
   />
   
   
    <div className="flex items-center justify-between">
    <Heading
    title={title}
    description={description}
    />
{initialData &&(
    <Button
    disabled={loading}
    variant="destructive"
    size="icon"
    onClick={() =>setOpen(true)}
    >
    <Trash className=" h-4 w-4"/>
    </Button>
    ) }
    </div>
    <Separator/>
    <Form {...form} >
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
    
  
    <div className="grid grid-cols-3 gap-8">
    <FormField
    control={form.control}
    name="name"
    render={({ field }) =>(
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input disabled={loading} placeholder="Category label" {...field}/>
        </FormControl>
        <FormMessage/>
      </FormItem>
    )}
    />
 
    <FormField
    control={form.control}
    name="billboardId"
    render={({ field }) =>(
      <FormItem>
        <FormLabel>Billboard</FormLabel>
        <Select disabled={loading}
         onValueChange={field.onChange} 
        value={field.value}
         defaultValue={field.value}
         >
          <FormControl>
            <SelectTrigger >
            <SelectValue
            defaultValue={field.value}
            placeholder="Select a billboard"
            />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
          {billboards.map((billboard) => (
            <SelectItem
            key={billboard.id}
            value={billboard.id}
            >
            {billboard.label}
            </SelectItem>
          ))}
          </SelectContent>
        </Select>
       
        <FormMessage/>
      </FormItem>
       )}
       />
    </div>
    <Button disabled={loading} className="ml-auto" type="submit"> {action}
      
    </Button>
    </form>
    </Form>
  
    </>
  )
}
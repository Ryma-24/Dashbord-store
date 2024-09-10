"use client"

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";

interface AlerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm:() => void;
  loading:boolean
}


export const AlertModal:React.FC<AlerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {
const [isMounted, setMounted] = useState(false)

useEffect(() =>{
  setMounted(true)
}, [])

if(!isMounted) {
  return null
}

return (
  <Modal
  title="Êtes vous sur ?"
  description="Action non reconnu"
  isOpen={isOpen}
  onClose={onClose}
  >

<div className="pt-6 space-x-2 flex items-center justify-end w-full">

<Button disabled={loading} variant="outline" onClick={onClose}>
  Annuler
</Button>
<Button disabled={loading} variant="destructive" onClick={onConfirm}>
 Continuer
</Button>

</div>
</Modal>


)
  
}
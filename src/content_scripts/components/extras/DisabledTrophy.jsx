import { Trophy, X } from "lucide-react";


function DisabledTrophy() {
   return ( 
      
   <div className="relative inline-block">
         
        <Trophy className="opacity-50" />
        <X
            className="absolute top-0 left-0 text-red-500"
            size={16}
            strokeWidth={3}
        />
   </div>
   
   );
}

export default DisabledTrophy;
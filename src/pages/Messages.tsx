import { useAppContext } from '@/lib/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

export default function Messages() {
  const { workers, users, currentUser, jobs } = useAppContext();
  const navigate = useNavigate();
  
  const myJobs = jobs.filter(j => currentUser?.role === 'worker' ? j.workerId === currentUser.id : j.userId === currentUser?.id);
  const chatPartnerIds = Array.from(new Set(myJobs.map(j => currentUser?.role === 'worker' ? j.userId : j.workerId)));
  
  let chats = chatPartnerIds.map(id => {
    if (currentUser?.role === 'worker') return users.find(u => u.id === id);
    return workers.find(w => w.id === id);
  }).filter(c => c !== undefined) as (typeof users[0] | typeof workers[0])[];
  
  if (chats.length === 0 && currentUser?.role === 'user') {
    chats = workers.slice(0, 2);
  }

  const uniqueChats = Array.from(new Map(chats.map(c => [c.id, c])).values());

  return (
    <div className="flex flex-col min-h-full bg-background pb-8 pt-4">
      <div className="px-4 mb-4">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>
      
      <div className="px-2">
        {uniqueChats.map((chatPartner: any) => (
          <div 
            key={chatPartner.id}
            onClick={() => navigate(`/chat/${chatPartner.id}`)}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/50 cursor-pointer transition-colors"
          >
            <div className="relative shrink-0">
              <Avatar className="h-12 w-12 border">
                <AvatarImage src={chatPartner.avatar} />
                <AvatarFallback>{chatPartner.name[0]}</AvatarFallback>
              </Avatar>
              <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-background rounded-full ${chatPartner.available !== undefined ? (chatPartner.available ? 'bg-green-500' : 'bg-muted') : 'bg-green-500'}`}></span>
            </div>
            
            <div className="flex-1 min-w-0 border-b border-border/50 pb-3 block">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold truncate pr-2">{chatPartner.name}</h3>
                <span className="text-[10px] text-muted-foreground shrink-0 mt-1">10:05 AM</span>
              </div>
              <div className="flex justify-between items-center pr-1">
                <p className="text-sm text-muted-foreground truncate">Hello! I saw your job request.</p>
                {chatPartner.id === 'w1' && (
                  <span className="flex items-center justify-center bg-primary text-primary-foreground text-[10px] h-4 w-4 rounded-full font-bold">
                    1
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

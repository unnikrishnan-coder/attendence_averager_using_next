import StickySidebar from '@/components/StickySidebar/StickySidebar';
import SideBar from '@/components/Sidebar/SideBar';

const DashBoard = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className='flex max-sm:flex-col max-sm:items-center max-sm:justify-center h-auto min-h-screen dashboard-bg'>
      <StickySidebar />
      <SideBar />
      <div className='w-[80vw] height-screen-2rem'>
        {children}
      </div>
    </div>
  )
}

export default DashBoard;
'use client';

import Link from 'next/link';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import PersonIcon from '@mui/icons-material/Person';
// import TaskAltIcon from '@mui/icons-material/TaskAlt';
// import BugReportIcon from '@mui/icons-material/BugReport';



const Menu = () => {


  const items = [
    {
    //   icon: <DashboardIcon className="text-gray-500" />,
      label: 'Dashboard',
      visible: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
    },
    {
    //   icon: <PersonIcon className="text-gray-500" />,
      label: 'User Management',
      href: '/dashboard/users',
      visible: ['ADMIN'],
    },
    {
    //   icon: <TaskAltIcon className="text-gray-500" />,
      label: 'Project Management',
      href: '/dashboard/project',
      visible: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
    },
    {
    //   icon: <BugReportIcon className="text-gray-500" />,
      label: 'Issues Management',
      href: '/dashboard/issue',
      visible: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
    },
  ];

  return (
    <div className="flex flex-col justify-between h-full px-2 py-4 bg-[#0F172A]">
  <div className="text-sm space-y-1">
    {items.map((item) => (
      <Link
        href={item.href ?? '/dashboard'}
        key={item.label}
        className="flex items-center justify-center lg:justify-start gap-2
                   text-gray-200 py-2 rounded-md
                   hover:bg-gray-800 transition"
      >
        <span className="hidden lg:block">{item.label}</span>
      </Link>
    ))}
  </div>
</div>


  );
};

export default Menu;

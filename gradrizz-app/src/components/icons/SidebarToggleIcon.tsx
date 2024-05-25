import SidebarToggleIconSvg from '~/assets/sidebar-2-layout-toggle-nav-navbar-svgrepo-com.svg?react';

const SidebarToggleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <SidebarToggleIconSvg
      {...props}
      width={props.width || '24'} // Set a default width
      height={props.height || '24'} // Set a default height
      className={`w-6 h-6 ${props.className}`} // Ensure the className can be overridden
    />
  );
  
  export default SidebarToggleIcon;
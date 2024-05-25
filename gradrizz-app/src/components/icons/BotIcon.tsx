import BotIconSvg from '~/assets/robot-svgrepo-com.svg?react';

const BotIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <BotIconSvg
      {...props}
      width={props.width || '24'} // Set a default width
      height={props.height || '24'} // Set a default height
      className={`w-6 h-6 ${props.className}`} // Ensure the className can be overridden
    />
  );
  
  export default BotIcon;
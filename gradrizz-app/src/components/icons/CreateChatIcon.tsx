import CreateChatIconSvg from '~/assets/chat-conversation-svgrepo-com.svg?react';

const CreateChatIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <CreateChatIconSvg
      {...props}
      width={props.width || '24'} // Set a default width
      height={props.height || '24'} // Set a default height
      className={`w-6 h-6 ${props.className}`} // Ensure the className can be overridden
    />
  );
  
  export default CreateChatIcon;
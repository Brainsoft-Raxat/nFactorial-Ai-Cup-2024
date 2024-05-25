import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '~/components/contexts/UserContext';
import Loading from '~/components/shared/Loading'; // Assuming you have a Loading component

const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const { state } = useAuthState();
    const navigate = useNavigate();

    useEffect(() => {
        if (state.state === 'SIGNED_OUT') {
            navigate('/login');
        }
    }, [state, navigate]);

    if (state.state === 'UNKNOWN') {
        return <Loading />;
    }

    return children;
};

export default RequireAuth;

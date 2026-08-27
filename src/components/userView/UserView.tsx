import { useSelector } from 'react-redux';
import UserDetails from '../userDetails/UserDetails'
import { useParams } from 'react-router';
import { RootState } from '../../redux/store';
import ProjectMemberships from '../projectMemberships/ProjectMemberships';

export default function UserView() {
    const { fin_kod } = useParams<{ fin_kod: string }>();
    const localFinKod = useSelector((state: RootState) => state.auth.fin_kod);
    const projectRole = useSelector((state: RootState) => state.auth.projectRole);
    const viewed = fin_kod ? fin_kod : localFinKod;

    return (
        <>
            <UserDetails fin_kod={viewed} />
            {/* Which teams this person is on. Reading somebody else's is an
                admin-only call, so only offer it to an admin. */}
            {viewed && (projectRole === 2 || viewed === localFinKod) ? (
                <ProjectMemberships finKod={viewed} />
            ) : null}
        </>
    )
}

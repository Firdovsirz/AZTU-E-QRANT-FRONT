import UserDetails from '../userDetails/UserDetails'
import { useParams } from 'react-router';

export default function UserView() {
    const { fin_kod } = useParams<{ fin_kod: string }>();

    console.log(fin_kod);
    
    return (
        <>
            <UserDetails fin_kod={fin_kod} />
        </>
    )
}

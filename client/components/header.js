import Link from 'next/link';

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', ref: '/auth/signup' },
    !currentUser && { label: 'Sign In', ref: '/auth/signin' },
    currentUser && { label: 'Sell Tickets', ref: '/tickets/create' },
    currentUser && { label: 'My Orders', ref: '/orders' },
    currentUser && { label: 'Sign Out', ref: '/auth/signout' },
  ]
    .filter(link => link)
    .map(({ label, ref }) => {
      return (
        <li key={ref} lclassName="nav-item">
          <Link href={ref} className='nav-link'>{label}</Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light px-5">
      <Link href="/" className='navbar-brand'>
        GitTix
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links}
        </ul>
      </div>
    </nav>
  )
}

export default Header;
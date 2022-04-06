import Header from './Header';
import Footer from './Footer';

const Layout = ({children}: any) => (
  <div>
    <Header/>
      {children}
    <Footer/>
  </div>
)

export default Layout;
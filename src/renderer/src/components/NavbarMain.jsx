import { Link } from '@nextui-org/react'

function NavbarMain() {
  //NavBar Component
  return (
    <div className="navbar flex justify-between">
      <div className="left-navbar w-[50%] ">
        <Link href="https://projectvirgil.net" target="_blank" className="text-[#DDDDDF]">
          <h1 className="brand-title">Virgil</h1>
        </Link>
      </div>
      <div className="right-navbar w-[50%]">
        <ul className="list-none flex p-0 m-3">
          <li className="m-3 element-navbar">
            <Link
              href="https://github.com/ProjecVirgil"
              target="_blank"
              className="text-[#DDDDDF] element-navbar"
            >
              <a>Github</a>
            </Link>
          </li>
          <li className="m-3 element-navbar">
            <Link href="" target="_blank" className="text-[#A58EF5] element-navbar">
              <a>Discord</a>
            </Link>
          </li>
          <li className="m-3 element-navbar">
            <Link
              href="https://status.projectvirgil.net"
              target="_blank"
              className="text-[#DDDDDF] element-navbar"
            >
              <a>Website</a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default NavbarMain

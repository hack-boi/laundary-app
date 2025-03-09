const Footer = () => {

    let year = new Date().getFullYear();
    return (
        <footer className="w-full text-gray-500 text-center py-4 my-4">
            <hr className="border-gray-300 my-4" />
            <p>Copyright &copy; {year}, All Right Reserved</p>
        </footer>
    );
}

export default Footer;

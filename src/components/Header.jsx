const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Mi Aplicación</h1>
        <nav>
          <a href="/" className="px-3 hover:underline">
            Inicio
          </a>
          <a href="/clientes" className="px-3 hover:underline">
            Clientes
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header

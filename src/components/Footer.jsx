const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center py-4 mt-10 shadow-inner">
      <p className="text-sm text-gray-600">
        © {new Date().getFullYear()} Mi Aplicación. Todos los derechos
        reservados.
      </p>
      <button
        className="text-blue-500 text-sm hover:underline mt-2"
      >
        Términos y condiciones
      </button>
    </footer>
  );
}

export default Footer
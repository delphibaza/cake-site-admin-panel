
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";

const Login = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-12 md:py-16">
          <div className="container flex justify-center px-4 md:px-6">
            <LoginForm />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;

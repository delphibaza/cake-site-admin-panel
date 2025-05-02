
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegistrationForm from "@/components/RegistrationForm";

const Register = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-12 md:py-16">
          <div className="container flex justify-center px-4 md:px-6">
            <RegistrationForm />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;

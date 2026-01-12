import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/UI/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card';
import { Package, Shield, Thermometer, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLaunchDemo = () => {
    navigate('/manufacturer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-in fade-in duration-700">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">PharmaChain</h1>
          <p className="text-xl md:text-2xl text-slate-700 mb-8 max-w-3xl mx-auto">
            Securing the Pharmaceutical Supply Chain with Blockchain & IoT
          </p>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Track pharmaceutical products from manufacturer to patient with immutable blockchain
            records and real-time cold chain monitoring. Prevent counterfeit drugs and ensure
            product integrity.
          </p>
          <Button
            size="lg"
            onClick={handleLaunchDemo}
            className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Launch Demo
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-xl transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white border border-slate-200">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-slate-900">Immutable Tracking</CardTitle>
              <CardDescription className="text-slate-600">
                Every product movement is recorded on the blockchain, creating an unalterable audit
                trail from manufacturer to patient.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Tamper-proof records</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Complete ownership history</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Transparent supply chain</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 bg-white border border-slate-200">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Thermometer className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-slate-900">Cold Chain Monitoring</CardTitle>
              <CardDescription className="text-slate-600">
                Real-time IoT sensor data ensures temperature-sensitive drugs maintain safe
                conditions throughout the supply chain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Continuous temperature tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Automatic violation alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Quality assurance metrics</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 bg-white border border-slate-200">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-slate-900">Counterfeit Prevention</CardTitle>
              <CardDescription className="text-slate-600">
                Blockchain verification ensures product authenticity, reducing counterfeit drug
                incidents by up to 90%.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>QR code verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Trust score calculation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Patient-accessible verification</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-8 mb-16 animate-in fade-in duration-700 delay-300">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">90%</div>
              <div className="text-slate-700">Reduction in Counterfeit Drugs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-slate-700">Immutable Record Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-slate-700">Real-time Monitoring</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-in fade-in duration-700 delay-500">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to Secure Your Supply Chain?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Experience the power of blockchain-based pharmaceutical tracking
          </p>
          <Button
            size="lg"
            onClick={handleLaunchDemo}
            variant="outline"
            className="text-lg px-8 py-6"
          >
            Start Demo
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

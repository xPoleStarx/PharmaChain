import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/UI/dialog';
import { Button } from '@/components/UI/button';
import { Card, CardContent } from '@/components/UI/card';
import { Download, Printer } from 'lucide-react';

interface QRCodeGeneratorProps {
  drugId: string;
  drugName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  drugId,
  drugName,
  isOpen,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const svg = document.getElementById('qrcode-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QRCode-${drugId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Print Product Label</DialogTitle>
          <DialogDescription className="text-slate-600">
            Generate a QR code label for this product. The QR code contains the product ID for easy
            verification.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Card className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg mb-1 text-slate-900">{drugName}</h3>
                <p className="text-sm text-slate-700 font-mono">{drugId}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-slate-200">
                <QRCodeSVG
                  id="qrcode-svg"
                  value={drugId}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-xs text-slate-600 text-center max-w-xs">
                Scan this QR code to verify product authenticity and view complete supply chain
                history
              </p>
            </div>
          </Card>
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Printer className="w-4 h-4 mr-2" />
            Print Label
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

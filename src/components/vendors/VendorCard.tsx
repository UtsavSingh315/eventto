import React from 'react';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';
import { Vendor } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface VendorCardProps {
  vendor: Vendor;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="truncate">{vendor.name}</CardTitle>
          <Badge variant="secondary" className="capitalize">
            {vendor.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 text-gray-500" />
            <a
              href={`mailto:${vendor.email}`}
              className="text-sm text-primary-600 hover:underline"
            >
              {vendor.email}
            </a>
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-gray-500" />
            <a
              href={`tel:${vendor.phone}`}
              className="text-sm text-gray-700"
            >
              {vendor.phone}
            </a>
          </div>
          {vendor.website && (
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2 text-gray-500" />
              <a
                href={vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:underline truncate"
              >
                {vendor.website}
              </a>
            </div>
          )}
          {vendor.address && (
            <div className="flex items-start">
              <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
              <p className="text-sm text-gray-700">{vendor.address}</p>
            </div>
          )}
          {vendor.notes && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Notes</p>
              <p className="text-sm text-gray-700">{vendor.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
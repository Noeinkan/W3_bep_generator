import React from 'react';

/**
 * DeliveryStatus — Shared TIDP/MIDP status summary section.
 *
 * @param {Object} props
 * @param {Array} props.tidpData - TIDP data array
 * @param {Array} props.midpData - MIDP data array
 */
const DeliveryStatus = ({ tidpData = [], midpData = [] }) => (
  <div className="mt-4 pt-4 border-t">
    <div className="text-sm text-gray-600 mb-2">Information Delivery Status</div>
    <div className="space-y-2 text-xs">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">TIDPs Created:</span>
        <span className={`font-medium ${tidpData.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
          {tidpData.length}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">MIDPs Generated:</span>
        <span className={`font-medium ${midpData.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
          {midpData.length}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">ISO 19650 Ready:</span>
        <span className={`font-medium ${tidpData.length > 0 && midpData.length > 0 ? 'text-green-600' : 'text-orange-500'}`}>
          {tidpData.length > 0 && midpData.length > 0 ? '✓' : '○'}
        </span>
      </div>
    </div>
  </div>
);

export default React.memo(DeliveryStatus);

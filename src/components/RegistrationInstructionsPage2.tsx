import React from 'react';

export const RegistrationInstructionsPage2: React.FC = () => {
  return (
    <div
      id="nv-registration-page-2"
      className="relative bg-white text-black select-text shadow-xl print-page mx-auto"
      style={{
        width: '816px',
        height: '1056px',
        padding: '38px 44px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {/* Top Header Note */}
      <div className="flex gap-8 items-start pt-2">
        {/* Left Column: APPLICATION INSTRUCTIONS & DECAL (Cyan Blue Color) */}
        <div style={{ width: '220px' }} className="text-[#0088cc] text-[8.5px] leading-relaxed">
          <div className="font-bold text-[9.5px] mb-1 uppercase tracking-tight">
            APPLICATION INSTRUCTIONS
          </div>
          <div className="font-bold text-[9px] mb-2 leading-tight">
            Note: DO NOT MOISTEN<br />DECAL
          </div>

          <ol className="list-decimal pl-3 space-y-1 text-[8px] leading-normal font-medium">
            <li>Verify plate number and decal number match.</li>
            <li>Clean and dry plate before affixing new decal.</li>
            <li>Remove decal by bending corner of card under decal along dotted line.</li>
            <li>Next, lift up corner of decal where card is creased.</li>
            <li>Decal is fragile - peel off slowly.</li>
            <li>Apply decal to upper right-hand corner of the license plate.</li>
            <li>Rub or press firmly around edges of decal after applying.</li>
          </ol>
        </div>

        {/* Right Column: LEGAL OWNERSHIP & STATUTORY REQUIREMENTS (Cyan Blue Color) */}
        <div className="flex-1 text-[#0088cc] text-[8.5px] leading-relaxed pl-2">
          <div className="font-bold text-[9.5px] mb-1">
            This certificate shows registered ownership only. Legal ownership is shown on the certificate of title.
          </div>
          <div className="font-bold text-[9px] mb-1">You Must:</div>

          <ol className="list-decimal pl-3 space-y-1.5 text-[8px] leading-snug font-medium mb-4">
            <li>
              <span className="font-semibold">Maintain security</span> (insurance or qualified self-insurer) for a motor vehicle, in the registered owner&apos;s name, for the entire time the vehicle is registered or should be registered in Nevada. The vehicle must be insured by an insurance company licensed in the State of Nevada. Out-of-state insurance will not be accepted. Keep evidence of Nevada insurance in the motor vehicle at all times. Trailers are exempt from insurance requirements.
            </li>
            <li>
              In order to avoid registration suspension and reinstatement fees and fines, you must cancel your registration certificate and license plates prior to cancelling your insurance. Remove your plates if you sell this vehicle. If you do not officially transfer these plates to another vehicle owned by you, you must surrender the license plates to the Department within 60 days.
            </li>
            <li>
              Carry this certificate, or a legible copy, in the vehicle. Immediately apply for a duplicate if your registration certificate or license plates/decals are lost, mutilated, or illegible.
            </li>
            <li>
              Notify the Department of Motor Vehicles within 30 days of moving to a new address.
            </li>
            <li>
              Reinstatement fees for an insurance lapse range from $250 to $750 and fines ranging from $250 to $1000 assessed on a tiered system based on the length of the lapse and the history of previous violation(s).
            </li>
          </ol>

          {/* Motor Carriers Section */}
          <div className="border-t border-[#0088cc]/30 pt-2">
            <div className="font-bold text-[8.5px] underline mb-1">
              Motor Carriers: In addition to 1, 4 and above, the following applies to Motor Carriers:
            </div>
            <ol className="list-decimal pl-3 space-y-1 text-[8px] leading-snug font-medium">
              <li>Motor Carriers must keep the original registration certificate or a legible copy in the vehicle.</li>
              <li>Motor Carriers are required to turn in license plates and registration cab cards in order to close an account.</li>
              <li>IRP Carriers are required to have continuous registration; if license plates and registration cab cards are not returned by the expiration date, registration fees continue to accrue every month thereafter.</li>
              <li>Motor Carriers not intending to renew a registration must return license plates within 10 days of the expiration.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-11 right-11 flex justify-between items-center text-[8px] text-neutral-400 border-t border-neutral-200 pt-2">
        <span>STATE OF NEVADA &bull; DEPARTMENT OF MOTOR VEHICLES</span>
        <span>PAGE 2 OF 2 &bull; REVERSE OF NVREG04</span>
      </div>
    </div>
  );
};

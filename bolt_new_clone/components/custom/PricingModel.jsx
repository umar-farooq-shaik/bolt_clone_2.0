import Lookup from '@/data/Lookup';
import React, { useContext, useEffect, useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

function PricingModel() {
  const { userDetail } = useContext(UserDetailContext);
  const [selectedOption, setSelectedOption] = useState();

  const UpdateToken = useMutation(api.users.UpdateToken);

  const onPaymentSuccess = async (pric, usr) => {
    const token = Number(usr?.token) + Number(pric?.value);
    await UpdateToken({
      token: token,
      userId: userDetail?._id,
    });
  };

  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Lookup.PRICING_OPTIONS.map((pricing, index) => (
        <div key={index} className="border p-7 rounded-xl flex flex-col gap-3 h-full">
          <h2 className="font-bold text-4xl">{pricing.name}</h2>
          <h2 className="font-medium text-lg">{pricing.tokens} Tokens</h2>
          <p className="text-gray-400 flex-grow">{pricing.desc}</p>

          {/* Pricing & PayPal button in same line */}
          <div className="mt-auto flex flex-col items-center justify-end h-full">
            <h2 className="font-bold text-4xl text-center">${pricing.price}</h2>
            {userDetail && (
              <div
                className="mt-3 w-full flex justify-center"
                onClick={() => setSelectedOption(pricing)}
              >
                <PayPalButtons
                  style={{ layout: 'horizontal' }}
                  disabled={!userDetail}
                  onCancel={() => console.log('Payment cancelled')}
                  onApprove={() => onPaymentSuccess(pricing, userDetail)}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: pricing.price,
                            currency_code: 'USD',
                          },
                        },
                      ],
                    });
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PricingModel;

function Assets({ stakedTokens }) {
  console.log('staked Tokens',stakedTokens);

  return (
    <div>
      {" "}
      <div className="bg-[#0d1b34] text-white min-h-screen flex flex-col">
        <div className="flex flex-col lg:flex-row flex-1 w-full  mx-auto">
          {/* <!-- Main Content --> */}
          <main className="flex-1 ">

            {/* <!-- Exchange Section --> */}
            <section className="bg-[#0d1b34] p-4 md:p-6 rounded-lg mb-6">
             
              {/* 
  <!-- Exchange Section --> */}
              {/* My Assets Section */}
              <h2 className="text-2xl font-bold mb-4">My Assets</h2>
              <section className="bg-[#1c2340] border  border-gray-600 mb-4 p-4 md:p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-3 gap-6 text-left">
                  <div className="p-1 flex flex-col items-start gap-6">
                    <p className="text-lg font-semibold text-gray-400">
                      Total Assets
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <img src="https://placehold.co/30x30" alt="Token" />
                      <p className="text-lg font-bold">0.00 ADT</p>
                    </div>
                  </div>
                  <div className=" p-1 flex flex-col items-start gap-6">
                    <p className="text-lg font-semibold text-gray-400">
                      Available Assets
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <img src="https://placehold.co/30x30" alt="Token" />
                      <p className="text-lg font-bold">0.00 ADT</p>
                    </div>
                  </div>
                  <div className=" p-1 flex flex-col items-start gap-6">
                    <p className="text-lg font-semibold text-gray-400">
                      My Tokens
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <img src="https://placehold.co/30x30" alt="Token" />
                      <p className="text-lg font-bold">{ stakedTokens } ADT</p>
                    </div>
                  </div>
                </div>
              </section>
            </section>

            {/* 
      <!-- Transactions Section --> */}
            <section className="bg-[#1c2340] border mx-6  border-gray-600 mb-4 p-4 md:p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Transactions</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 text-[#9197b0] gap-4 md:gap-0">
                <span>Time</span>
                <span>Quantity</span>
                <span>Amount</span>
                <span className="">Actions</span>
                <span>Transaction Hash</span>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Assets;

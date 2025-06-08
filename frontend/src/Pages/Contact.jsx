
export default function Contact() {
  return (
    <>
     <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-5">
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Contact Us</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Message Form */}
          <div className="bg-gray-700 p-6 rounded-md">
            <h3 className="text-2xl font-semibold mb-4">Send us a Message</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                className="w-full p-3 bg-gray-900 rounded-md border border-gray-700 focus:ring focus:ring-orange-500"
              />
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full p-3 bg-gray-900 rounded-md border border-gray-700 focus:ring focus:ring-orange-500"
              />
              <input
                type="text"
                placeholder="How can we help?"
                className="w-full p-3 bg-gray-900 rounded-md border border-gray-700 focus:ring focus:ring-orange-500"
              />
              <textarea
                placeholder="Your message..."
                rows="4"
                className="w-full p-3 bg-gray-900 rounded-md border border-gray-700 focus:ring focus:ring-orange-500"
              />
              <button
                type="submit"
                className="w-full p-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-700 p-6 rounded-md">
            <h3 className="text-2xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <p>
                <span className="font-semibold">Location:</span> 123 Cloud Kitchen St, NY 10001
              </p>
              <p>
                <span className="font-semibold">Phone:</span> +1 (555) 123-4567
              </p>
              <p>
                <span className="font-semibold">Email:</span> contact@cloudbite.com
              </p>
              <p>
                <span className="font-semibold">Hours:</span> Mon-Sun: 10:00 AM - 10:00 PM
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-2">Delivery Area</h3>
              <ul className="list-disc ml-5">
                <li>Manhattan (All areas)</li>
                <li>Brooklyn (Selected areas)</li>
                <li>Queens (Selected areas)</li>
                <li>Long Island City</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div> 
    </>
  )
}

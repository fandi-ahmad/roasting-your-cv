import { useState, useRef } from 'react'
import { GoogleGenerativeAI } from "@google/generative-ai"
import pdfToText from "react-pdftotext";
import Loader from './components/Loader';
import TypingText from './components/TypingText';
import Card from './components/Card';
import Linked from './components/Linked';

function App() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mainprompt = 'buatlah 1 paragraf untuk mengritik isi dari cv ini untuk lebih baik lagi secara panas, beri tau bagian mana yang perlu diperbaiki jika ada, dengan kalimat yang sedikit kasar dan agak nyeselin tapi masih wajar. dalam kritik yang diberikan gunakan kalimat analogi (salah satu contohnya, cv mu ini cocok jadi daftar menu makanan yang hanya menampilkan daftar menu, atau gunakan contoh lain jika memang lebih mendekati, tidak harus dengan daftar menu makanan). jika dirasa cv ini kurang sesuai dengan apa karir yang dituju, kasih tau cocoknya jadi apa yang sangat-sangat jauh dari karir yang ingin ditujunya berdasarkan kritikan. di awal kalimat panggil namanya dan gunakan bahasa indonesia'
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [isDisableBtn, setIsDisableBtn] = useState<boolean>(false)


  // GEMINI AI PROMPT
  const API_KEY = import.meta.env.VITE_API_KEY
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const runPrompt = async () => {
    try {
      if (prompt) {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        setResult(text)
      } else {
        alert('Upload file CV mu terlebih dahulu!')
      }
    } catch (error) {
      alert('Terjadi kesalahan!')      
    }
  }

  const extractTextFromPdf = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Memeriksa ukuran file (5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        alert('Maksimal size 5mb!')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        const text = await pdfToText(file)
        setPrompt(`${text} \n\n ${mainprompt}`)
      }
    }
  }

  const handleClickBtn = async () => {
    try {
      setIsDisableBtn(true)
      await runPrompt()
      setIsDisableBtn(false)
    } catch (error) {
      alert('Terjadi kesalahan!')
    }
  }


  return (
    <div className="px-2 sm:px-12 md:px-36 lg:px-64 xl:px-80 md:py-8 text-gray-700">
      <h1 className='text-2xl font-semibold mb-4 ps-2 pt-4 md:ps-0 md:pt-0 text-white'>Roasting Your CV</h1>

      <Card>
        <ol className='list-decimal ps-4'>
          <li>Upload file CV mu dengan format <b>PDF</b> dan maksimal size <b>5 mb</b></li>
          <li>Klik tombol "Roasting sekarang"</li>
          <li>Selamat menikmati roastingan😅</li>
        </ol>
      </Card>

      <Card>
        <p className='text-sm font-medium mb-1'>Upload CV</p>
        <input type="file" accept="application/pdf" onChange={extractTextFromPdf} ref={fileInputRef} className='w-full p-1 rounded-md border border-gray-400 cursor-pointer' />
        <div className='flex flex-row justify-start items-center mt-4'>
          <button disabled={isDisableBtn} onClick={handleClickBtn} className='bg-orange-600 hover:bg-orange-500 disabled:bg-orange-300 duration-200 opacity-90 rounded-md px-2 py-1 text-white'>
            Roasting sekarang
          </button>
          <div className={isDisableBtn ? '' : 'hidden'}>
            <Loader/>
          </div>
        </div>
      </Card>

      { result &&
        <Card>
          <p className='text-3xl font-medium'>🤖</p>
          <hr className='my-2 border-slate-400' />
          <TypingText text={result} />
        </Card>
      }

      <Linked/>
    </div>
  )
}

export default App
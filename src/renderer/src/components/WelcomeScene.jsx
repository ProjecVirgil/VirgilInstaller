import Image1 from '../assets/img/img0.svg'
import Image2 from '../assets/img/img1.svg'
import Image3 from '../assets/img/img2.svg'
import Image4 from '../assets/img/img3.svg'

function Welcome() {
  return (
    <div className="markdown-content">
      <h1>
        Virgil AI <strong>Welcome</strong> 🏛️
      </h1>
      <hr />
      <div className="flex  parent">
        <img src={Image1} alt="VirgilAI" className="div1" />
        <img src={Image2} alt="GitHub commit activity (branch)" className="div2" />
        <img src={Image3} alt="GitHub repo size" className="div3" />
        <a
          href="https://scrutinizer-ci.com/g/Retr0100/VirgilAI/?branch=master"
          target="_blank"
          rel="noreferrer"
          className="div4"
        >
          <img src={Image4} alt="Scrutinizer Code Quality" />
        </a>
      </div>
      <h2>Introduction</h2>
      <hr />
      <p>
        Created in principle with <a href="https://www.python.org/downloads/">python3.11</a> and
        various libraries such as{' '}
        <a href="https://pypi.org/project/SpeechRecognition/">SpeechRecognition</a> and{' '}
        <a href="https://pypi.org/project/gTTS/">TTS library</a>.
      </p>
      {/* ... similar conversion for rest of the paragraph ... */}

      <h3>🔑 Key features</h3>
      <p>
        <strong>You can ask many questions on Virgilio, like us:</strong>.
      </p>
      <ul>
        <li>The time ⏲️</li>
        <li>The weather 🌧️</li>
        <li>The latest news 🗞️</li>
        <li>Change the volume 🔉</li>
        <li>The temperature 🌡️</li>
        <li>Days of the week 📆</li>
        <li>Interact with the domotic (Merros device only) 💡</li>
        <li>Timer 🔂</li>
        <li>Ask a Virgil to remember your commitments 🗓️</li>
        <li>Media player 🎵</li>
        <li>
          and ask <strong>whatever you want</strong> how: Virgilio explain quantum math 🤖
        </li>
      </ul>
      <p>
        <strong>Is fast to use:</strong>
      </p>
      <ul>
        <li>In fact, all you have to do is insert the key into the app and you&#39;re done ✅</li>
      </ul>
      <p>
        <strong>Portable:</strong>
      </p>
      <ul>
        <li>You can use it on any linux/windows 🌐</li>
      </ul>

      <h3>
        Guide to <strong>LOCAL</strong> settings
      </h3>
      <ul>
        <li>
          Virgil Settings
          <ul>
            <li>
              <strong>Startup</strong>: The program will be started every time the PC is started.
            </li>
            <li>
              <strong>Default interface type</strong>: You can choose whether to start virgilio with
              a text or voice interface by default (if you do not wish to set a default interface,
              you will be asked each time).
            </li>
            <li>
              <strong>Run without console (background)</strong>: Virgil will start and run in the
              background without a console (this option is only available when using the voice
              interface).
            </li>
          </ul>
        </li>
        <li>
          <strong>Debug settings</strong> (You can also ignore these)
          <ul>
            <li>
              Debug level: You can decide which debug level can be displayed on the screen, by
              default it is set to info (So all logs above and equal to info will be displayed, not
              recommended at first).
            </li>
            <li>
              <strong>Write to file</strong>: Scrittura dei logs in un file (Se saranno scritti un
              in file non verranno visualizzati a schermo)
            </li>
          </ul>
        </li>
      </ul>

      <h3>
        Guide to <strong>ONLINE</strong> settings
      </h3>
      <h4>Difference between online and local settings</h4>
      <ul>
        <li>
          <strong>Local</strong>: Local settings are obviously not synchronised on each device and
          need to be set up for each environment, and some settings such as debugging settings can
          be set directly from code without too much effort.
        </li>
        <li>
          <strong>Online</strong>: Online settings are synchronised on each device, but can only be
          changed via the APP, which is unfortunately only available for Android.
        </li>
      </ul>
      <a href="https://github.com/ProjecVirgil/VirgilAI" target="_blank" rel="noreferrer">
        <p className="text-[#a58ef5] underline">
          <strong> For know how use the online settings go on the github page</strong>
        </p>
      </a>

      <h3>Guide to ElevenLabs</h3>
      <p>
        Elevenlabs is a service to reproduce tts by deeplearning and the key is free but is
        necessary an account but the tokens are very few...
        <strong>But is there a trick to have </strong>UNLIMITED
        <strong> accounts with the same email?</strong>
      </p>
      <p>
        <strong>Explanation:</strong>
      </p>
      <ol>
        <li>Take any gmail</li>
        <li>Add a dot anywhere in the email</li>
        <li>And the confirmation email will be sent</li>
      </ol>
      <p>
        <strong>Example:</strong>
      </p>
      <p>
        Original email: <code>example@gmail.com</code>. Email with dots added:{' '}
        <code>example.@gmail.com</code> or <code>e.xample@gmail.com</code>.
      </p>

      <h2>Notes</h2>
      <hr />
      <h3>In this paragraph I will add secondary items or updates released</h3>
      <ul>
        <li>
          Soon the{' '}
          <strong>
            <em>
              <a href="https://www.babelmatrix.org/works/it/Dante%2C_Alighieri-1265/La_Divina_Commedia._Purgatorio._Canto_I./en/4208-The_Divine_Comedy.__Purgatorio._Canto_I.">
                CATONE
              </a>{' '}
              UPDATE
            </em>
          </strong>{' '}
          (Purgatory chant I vv-61 to vv-66) 🗻
        </li>
      </ul>
      <h2>Other</h2>
      <hr />
      <p>
        As mentioned above, VirgililAI is part of a larger project that includes an app, a website
        and others, the links of which are at Project:
      </p>
      <h3>
        <a target="_blank" rel="noreferrer" href="https://projectvirgil.net">
          Website
        </a>
      </h3>
      <h3>
        <a target="_blank" rel="noreferrer" href="https://github.com/Retr0100/VirgilApp">
          Mobile APP
        </a>
      </h3>
      <h3>
        <a target="_blank" rel="noreferrer" href="https://github.com/Retr0100/VirgilML">
          Analysis of ML
        </a>
      </h3>
      <h2>Credits</h2>
      <hr />
      <p>
        The project is made by one person and is still in development, I&#39;m looking for someone
        to give me advice and a hand to continue the project, which I believe is an excellent open
        source and free alternative to devices like Alexa or Google Home.
      </p>
      <h3>Contact me</h3>
      <p>
        For code related issues you can use github directly for other collaborations or alerts write
        to this email{' '}
        <a href="&#109;&#97;&#x69;&#x6c;&#116;&#x6f;&#x3a;&#112;&#x72;&#x6f;&#106;&#101;&#x63;&#x74;&#x76;&#x69;&#x72;&#103;&#105;&#108;&#97;&#x69;&#x40;&#103;&#x6d;&#97;&#105;&#108;&#x2e;&#x63;&#x6f;&#109;">
          &#112;&#x72;&#x6f;&#106;&#101;&#x63;&#x74;&#x76;&#x69;&#x72;&#103;&#105;&#108;&#97;&#x69;&#x40;&#103;&#x6d;&#97;&#105;&#108;&#x2e;&#x63;&#x6f;&#109;
        </a>
      </p>
      <p>
        If you want to support a small developer take a{' '}
        <a href="https://www.paypal.me/Retr0jk" target="_blank" rel="noreferrer">
          <strong>special link</strong>
        </a>
      </p>
      <p>
        <a href="https://www.paypal.com/paypalme/Retr0jk" target="_blank" rel="noreferrer">
          <img
            width="200"
            align="center"
            src="https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white"
          />
        </a>
      </p>
      <h3>Licence</h3>
      <ul>
        <li>AGPL-3.0 licence</li>
        <li>
          <a href="https://github.com/Retr0100/VirgilAI/blob/master/LICENSE">LICENSE FILE</a>
        </li>
      </ul>
    </div>
  )
}

export default Welcome

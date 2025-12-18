class VideoComponent extends HTMLElement {
  static currentlyPlaying = null; // shared across all instances

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.handleClick = this.togglePlay.bind(this);
    this.handlePlay = this.onPlay.bind(this);
    this.handlePause = this.onPause.bind(this);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 800px;
        }
        .wrapper {
          position: relative;
        }
        video {
          width: 100%;
          display: block;
        }
        button {
          position: absolute;
          inset: auto auto 1rem 1rem;
          padding: 0.5rem 1rem;
          background: black;
          color: white;
          border: none;
          cursor: pointer;
        }
      </style>

      <div class="wrapper">
        <video></video>
        <button type="button">Play</button>
      </div>
    `;
  }

  connectedCallback() {
    this.video = this.shadowRoot.querySelector("video");
    this.button = this.shadowRoot.querySelector("button");

    const src = this.getAttribute("video-src");
    const poster = this.getAttribute("video-poster");

    if (src) this.video.src = src;
    if (poster) this.video.poster = poster;

    this.button.addEventListener("click", this.handleClick);
    this.video.addEventListener("play", this.handlePlay);
    this.video.addEventListener("pause", this.handlePause);
  }

  disconnectedCallback() {
    this.button.removeEventListener("click", this.handleClick);
    this.video.removeEventListener("play", this.handlePlay);
    this.video.removeEventListener("pause", this.handlePause);

    // cleanup global reference
    if (VideoComponent.currentlyPlaying === this.video) {
      VideoComponent.currentlyPlaying = null;
    }
  }

  togglePlay() {
    if (this.video.paused) {
      this.video.play(); // async, will trigger "play" event
    } else {
      this.video.pause();
    }
  }

  onPlay() {
    // Pause any previously playing video
    if (
      VideoComponent.currentlyPlaying &&
      VideoComponent.currentlyPlaying !== this.video
    ) {
      VideoComponent.currentlyPlaying.pause();
    }

    VideoComponent.currentlyPlaying = this.video;
    this.button.textContent = "Pause";
  }

  onPause() {
    if (VideoComponent.currentlyPlaying === this.video) {
      VideoComponent.currentlyPlaying = null;
    }
    this.button.textContent = "Play";
  }

  handleClick() {
    this.togglePlay();
  }
}

customElements.define("video-player", VideoComponent);

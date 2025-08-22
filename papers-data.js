// ABOUTME: Embedded paper data for portfolio website
// ABOUTME: This file contains all paper data to avoid CORS issues with local files

const PAPERS_DATA = [
    {
        id: "paper1",
        title: "MAVL: A Multilingual Audio-Video Lyrics Dataset for Animated Song Translation",
        authors: "<b>Woohyun Cho</b>, Youngmin Kim, Sunghyun Lee, Youngjae Yu",
        venue: "EMNLP 2025",
        year: 2025,
        categories: ["multimodal", "speech"],
        abstract:
            "Lyrics translation requires both accurate semantic transfer and preservation of musical rhythm, syllabic structure, and poetic style. In animated musicals, the challenge intensifies due to alignment with visual and auditory cues. We introduce Multilingual Audio-Video Lyrics Benchmark for Animated Song Translation (MAVL), the first multilingual, multimodal benchmark for singable lyrics translation. By integrating text, audio, and video, MAVL enables richer and more expressive translations than text-only approaches. Building on this, we propose Syllable-Constrained Audio-Video LLM with Chain-of-Thought SylAVL-CoT, which leverages audio-video cues and enforces syllabic constraints to produce natural-sounding lyrics. Experimental results demonstrate that SylAVL-CoT significantly outperforms text-based models in singability and contextual accuracy, emphasizing the value of multimodal, multilingual approaches for lyrics translation.",
        image: "papers/images/mavl-figure.png",
        detailPage: "papers/paper1.html",
        links: {
            paper: "https://arxiv.org/abs/2505.18614",
            code: "https://github.com/k1064190/MAVL",
            data: "https://huggingface.co/datasets/Noename/MAVL",
            bibtex: "@misc{cho2025mavlmultilingualaudiovideolyrics,\ntitle={MAVL:Multilingual Audio-Video Lyrics Dataset for Animated Song Translation},\nauthor={Woohyun Cho and Youngmin Kim and Sunghyun Lee and Youngjae Yu},\nyear={2025},\neprint={2505.18614\narchivePrefix={arXiv},\nprimaryClass={cs.CL},\nurl={[https://arxiv.org/abs/2505.18614](https://arxiv.org/abs/2505.18614)},\n}",
        },
        highlight: true,
        order: 2,
    },
    {
        id: "paper2",
        title: "Revisiting Residual Connections: Orthogonal Updates for Stable and Efficient Deep Networks",
        authors:
            "Giyeong Oh, <b>Woohyun Cho</b>, Siyeol Kim, Suhwan Choi, Youngjae Yu",
        venue: "Under Review",
        year: 2025,
        categories: ["Others"],
        abstract:
            "Residual connections are pivotal for deep neural networks, enabling greater depth by mitigating vanishing gradients. However, in standard residual updates, the module's output is directly added to the input stream. This can lead to updates that predominantly reinforce or modulate the existing stream direction, potentially underutilizing the module's capacity for learning entirely novel features. In this work, we introduce Orthogonal Residual Update: we decompose the module's output relative to the input stream and add only the component orthogonal to this stream. This design aims to guide modules to contribute primarily new representational directions, fostering richer feature learning while promoting more efficient training. We demonstrate that our orthogonal update strategy improves generalization accuracy and training stability across diverse architectures (ResNetV2, Vision Transformers) and datasets (CIFARs, TinyImageNet, ImageNet-1k), achieving, for instance, a +4.3%p top-1 accuracy gain for ViT-B on ImageNet-1k.",
        image: "papers/images/ortho-figure.png",
        detailPage: "papers/paper2.html",
        links: {
            paper: "https://arxiv.org/abs/2505.11881",
            code: "https://github.com/BootsofLagrangian/ortho-residual",
            bibtex: "@article{oh2025revisitingresidualconnectionsorthogonal,\n      title={Revisiting Residual Connections: Orthogonal Updates for Stable and Efficient Deep Networks}, \n      author={Giyeong Oh and Woohyun Cho and Siyeol Kim and Suhwan Choi and Younjae Yu},\n      year={2025},\n      journal={arXiv preprint arXiv:2505.11881},\n      eprint={2505.11881},\n      archivePrefix={arXiv},\n      primaryClass={cs.CV},\n      url={https://arxiv.org/abs/2505.11881}\n}",
        },
        highlight: false,
        order: 1,
    },
    {
        id: "paper3",
        title: "SEAL: Entangled White-box Watermarks on Low-Rank Adaptation",
        authors:
            "Giyeong Oh, Saejin Kim, <b>Woohyun Cho</b>, Sangkyu Lee, Jiwan Chung, Dokyung Song, Youngjae Yu",
        venue: "Under Review",
        year: 2025,
        categories: ["Others"],
        abstract:
            "Recently, LoRA and its variants have become the de facto strategy for training and sharing task-specific versions of large pretrained models, thanks to their efficiency and simplicity. However, the issue of copyright protection for LoRA weights, especially through watermark-based techniques, remains underexplored. To address this gap, we propose SEAL (SEcure wAtermarking on LoRA weights), the universal whitebox watermarking for LoRA. SEAL embeds a secret, non-trainable matrix between trainable LoRA weights, serving as a passport to claim ownership. SEAL then entangles the passport with the LoRA weights through training, without extra loss for entanglement, and distributes the finetuned weights after hiding the passport. When applying SEAL, we observed no performance degradation across commonsense reasoning, textual/visual instruction tuning, and text-to-image synthesis tasks. We demonstrate that SEAL is robust against a variety of known attacks: removal, obfuscation, and ambiguity attacks.",
        image: "papers/images/seal-figure.png",
        detailPage: "papers/paper3.html",
        links: {
            paper: "https://arxiv.org/abs/2501.09284",
            bibtex: "@misc{oh2025sealentangledwhiteboxwatermarks,\n  title={SEAL: Entangled White-box Watermarks on Low-Rank Adaptation},\n  author={Giyeong Oh and Saejin Kim and Woohyun Cho and Sangkyu Lee and Jiwan Chung and Dokyung Song and Youngjae Yu},\n  year={2025},\n  eprint={2501.09284},\n  archivePrefix={arXiv},\n  primaryClass={cs.AI},\n  url={https://arxiv.org/abs/2501.09284}\n}",
        },
        highlight: false,
        order: 3,
    },
];

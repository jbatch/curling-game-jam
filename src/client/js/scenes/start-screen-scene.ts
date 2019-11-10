'use strict';

import 'phaser';
import SceneManager from '../util/scene-manager';

export default class StartScreenScene extends Phaser.Scene {
  private sceneManager: SceneManager;
  private width: number;
  private height: number;

  constructor() {
    super({ key: 'StartScene', active: true, visible: true });
  }

  init() {}

  preload() {
    this.load.image('puck', './media/puck.png');
  }

  create(data) {
    this.sceneManager = SceneManager.getInstance(this.scene);
    this.scene.setVisible(true);
    this.width = this.game.config.width as number;
    this.height = this.game.config.height as number;

    this.add.image(this.width / 2, this.height * 0.3, 'puck');
    this.add.text(this.width / 2, 0, 'Super Curling Game!', { fontSize: '50px' }).setOrigin(0.5, 0);
    this.add
      .text(this.width / 2, 70, 'A very work in progress game jam', { fontSize: '20px' })
      .setOrigin(0.5, 0);

    const becomeHostButton = this.add.dom(
      this.width / 2,
      this.height * 0.6,
      'button',
      'height: 50px; width: 200px; font-size: 28px; border-radius: 14px;',
      'Become Host'
    );
    const joinGameButton = this.add.dom(
      this.width / 2,
      this.height * 0.7,
      'button',
      'height: 50px; width: 200px; font-size: 28px; border-radius: 14px;',
      'Join Game'
    );

    becomeHostButton.node.addEventListener('click', () => {
      this.scene.start('HostLobby');
      this.scene.stop('StartScene');
    });
    joinGameButton.node.addEventListener('click', () => {
      this.scene.start('PlayerLobbyInput');
      this.scene.stop('StartScene');
    });

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') || 'NONE';
    this.sceneManager.startSceneFromMode(mode);
  }

  update(time, delta) {}
}

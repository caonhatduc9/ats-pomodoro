import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Asset } from './asset.entity';

@Entity('playlist', { schema: 'ats_pomodoro' })
export class Playlist {
  @PrimaryGeneratedColumn({ type: 'int', name: 'playlist_id' })
  playlistId: number;

  @Column('varchar', { name: 'playlist_name', nullable: true, length: 100 })
  playlistName: string | null;

  @Column('text', { name: 'playlist_avatar', nullable: true })
  playlistAvatar: string | null;

  @Column('varchar', { name: 'description', nullable: true, length: 200 })
  description: string | null;

  @OneToMany(() => Asset, (asset) => asset.playlist2)
  assets: Asset[];
}

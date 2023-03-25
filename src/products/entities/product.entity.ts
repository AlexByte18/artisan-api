import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, BeforeUpdate } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string
    
    @Column('text', {
        unique: true
    })
    title: string

    @Column('numeric', {
        default: 0
    })
    price: number

    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @Column({
        type: 'text',
        unique: true,
        nullable: true
    })
    slug: string

    @Column('int', {
        default: 0
    })
    stock: Number

    @Column('text', {
        array: true
    })
    sizes: string[]

    @Column('text')
    gender: string
    
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    @BeforeInsert()
    checkSlug() {

      if (!this.slug) {
        this.slug = this.title
      }

      this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll("'", '')

    }

    @BeforeUpdate()
    checkSlugUpdate() {

      this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll("'", '')
  
    }

}

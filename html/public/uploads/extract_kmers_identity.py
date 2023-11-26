import argparse
from Bio.Align import AlignInfo
from Bio import SeqIO, AlignIO

def extract_kmers(inName, outName, k, identityPct, orf):
	align = AlignIO.read(inName, "fasta")

	identityPct = identityPct / 100 # Convert from % to float
	summary_align = AlignInfo.SummaryInfo(align)
	consensus = summary_align.dumb_consensus(threshold=identityPct, ambiguous='X')

	# Split the consensus into "pieces" according to whenever an X was found
	pieces = consensus.split("X")
	count = 1

	# Enter each individual piece
	#with open("ORF1_75mers.fasta", 'a') as w:
	with open(outName, "w") as fhOut:
		for piece in pieces:

			length = len(piece) # Find length for that piece
			lCount = 0 # Initialize lCount for next part

			while lCount < length: # While the lCount index hasn't reached end
				pi = piece[lCount:] # Cut substring of piece starting at lCount
				if len(pi) >= k: # If length of that subpiece is >= 75
					string = ">"+orf+"_"+str(k)+"mers_" + str(count)
					#print(string)
					fhOut.write(string + "\n")
					count += 1 
					#print(pi[0:k]) # Cut out 75mer from index 0
					fhOut.write(str(pi[0:k]) + "\n") # Cut out 75mer from index 0
				lCount += 1	

if __name__ == "__main__":
	parser = argparse.ArgumentParser(description="Generate k-mers from columns with specified % of identity")
	parser.add_argument("inFASTA", help="Full path to FASTA file with sequences")
	parser.add_argument("outFASTA", help="Full path to FASTA file that will store the k-mers")
	parser.add_argument("-k", type=int, default=50, help="k-mer size")
	parser.add_argument("-i", type=int, default=95, help="Identity %")
	parser.add_argument("-p", help="String prefix for k-mer")
	args = parser.parse_args()
	#extract_kmers(args.inFASTA, args.outFASTA, args.k, args.p)
	extract_kmers(args.inFASTA, args.outFASTA, args.k, args.i, args.p)
